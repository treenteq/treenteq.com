"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import * as XLSX from "xlsx";
import { Upload } from "lucide-react";
import Papa, { ParseResult } from "papaparse";

interface ValidationResult {
    success: boolean;
    errorDetails?: {
        row: number;
        column: number;
        value: any;
        expectedType: string;
    }[];
}

const validateColumn = (
    columnData: any[],
    columnIndex: number,
    dominanceThreshold = 0.7
): ValidationResult => {
    const typeCounts = {
        number: 0,
        string: 0,
        boolean: 0,
        date: 0,
        undefined: 0,
    };

    columnData.forEach((value) => {
        if (value === null || value === undefined) {
            typeCounts.undefined++;
        } else if (
            typeof value === "number" ||
            (!isNaN(parseFloat(value)) && isFinite(value))
        ) {
            typeCounts.number++;
        } else if (
            value === "true" ||
            value === "false" ||
            typeof value === "boolean"
        ) {
            typeCounts.boolean++;
        } else if (
            !isNaN(Date.parse(value)) &&
            new Date(value).toString() !== "Invalid Date"
        ) {
            typeCounts.date++;
        } else {
            typeCounts.string++;
        }
    });

    const totalValidValues = columnData.length - typeCounts.undefined;

    const dominantType = Object.keys(typeCounts).reduce((a, b) =>
        typeCounts[a as keyof typeof typeCounts] >
        typeCounts[b as keyof typeof typeCounts]
            ? a
            : b
    ) as keyof typeof typeCounts;

    if (typeCounts[dominantType] / totalValidValues < dominanceThreshold) {
        return {
            success: false,
            errorDetails: [
                {
                    row: -1,
                    column: columnIndex,
                    value: null,
                    expectedType: "Dominance threshold not met",
                },
            ],
        };
    }

    const errorDetails: {
        row: number;
        column: number;
        value: any;
        expectedType: string;
    }[] = [];
    columnData.forEach((value, rowIndex) => {
        if (value === null || value === undefined) return;
        let isValid = false;

        if (dominantType === "number") {
            isValid =
                typeof value === "number" ||
                (!isNaN(parseFloat(value)) && isFinite(value));
        } else if (dominantType === "string") {
            isValid = typeof value === "string";
        } else if (dominantType === "boolean") {
            isValid =
                value === "true" ||
                value === "false" ||
                typeof value === "boolean";
        } else if (dominantType === "date") {
            isValid = !isNaN(Date.parse(value));
        }

        if (!isValid) {
            errorDetails.push({
                row: rowIndex + 2,
                column: columnIndex + 1,
                value,
                expectedType: dominantType,
            });
        }
    });

    return errorDetails.length > 0
        ? { success: false, errorDetails }
        : { success: true };
};

const parseCSV = (file: File): Promise<any[][]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: (results: ParseResult<any>) => {
                if (results.errors.length > 0) {
                    reject(new Error("Error parsing CSV file"));
                } else {
                    resolve(results.data);
                }
            },
            error: (error: Error) => {
                reject(error);
            },
        });
    });
};

const DatasetValidator: React.FC<{
    onValidation: (result: {
        success: boolean;
        errorDetails?: string;
        data?: (string | number | boolean)[][];
        file?: File;
    }) => void;
}> = ({ onValidation }) => {
    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            let jsonData: (string | number | boolean)[][];

            if (file.name.toLowerCase().endsWith(".csv")) {
                // Handle CSV files
                jsonData = await parseCSV(file);
            } else {
                // Handle Excel files
                const reader = new FileReader();
                const data = await new Promise<ArrayBuffer>(
                    (resolve, reject) => {
                        reader.onload = (e) =>
                            resolve(e.target?.result as ArrayBuffer);
                        reader.onerror = reject;
                        reader.readAsArrayBuffer(file);
                    }
                );

                const workbook = XLSX.read(new Uint8Array(data), {
                    type: "array",
                });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            }

            const [header, ...rows] = jsonData;

            const validationResults = header.map((columnName, index) => {
                const columnData = rows.map((row) => row[index]);
                return {
                    columnName,
                    ...validateColumn(columnData, index),
                };
            });

            const failedValidations = validationResults.filter(
                (result) => !result.success
            );
            if (failedValidations.length > 0) {
                const errorMessage = failedValidations
                    .map((validation) => {
                        if (
                            validation.errorDetails?.[0].expectedType ===
                            "Dominance threshold not met"
                        ) {
                            return `Column "${validation.columnName}": No dominant type found`;
                        }
                        return `Column "${
                            validation.columnName
                        }": Invalid values found at rows ${validation.errorDetails
                            ?.map((err) => err.row)
                            .join(", ")}. Expected type: ${
                            validation.errorDetails?.[0].expectedType
                        }`;
                    })
                    .join("\n");
                onValidation({ success: false, errorDetails: errorMessage });
            } else {
                onValidation({ success: true, data: jsonData, file });
            }
        } catch (error) {
            console.error("Error processing file:", error);
            onValidation({
                success: false,
                errorDetails:
                    "Error processing file. Please ensure it's a valid Excel or CSV file.",
            });
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
            >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                    Click to upload Excel or CSV file
                </span>
            </label>
            <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
            />
        </div>
    );
};

export default DatasetValidator;

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import * as XLSX from "xlsx";

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

const ExcelValidator: React.FC<{
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

        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as (
                | string
                | number
                | boolean
            )[][];
            const [header, ...rows] = jsonData;

            const validationResults = header.map((columnName, index) => {
                const columnData = rows.map((row) => row[index]);
                return {
                    columnName,
                    ...validateColumn(columnData, index),
                };
            });

            console.log("Validation Results:", validationResults);

            const failedValidations = validationResults.filter(
                (result) => !result.success
            );
            if (failedValidations.length > 0) {
                console.error("Validation Failed:", failedValidations);
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
                console.log("All columns are valid!");
                onValidation({ success: true, data: jsonData, file });
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1>Excel Validator</h1>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                }}
            />
            <p>
                Upload an Excel file to validate its columns. Check the console
                for results.
            </p>
        </div>
    );
};

export default ExcelValidator;

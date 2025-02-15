import Image from 'next/image';
import blob from '../../public/3d-blob.svg';
import cube from '../../public/cube-bundle.svg';

export default function Background() {
    return (
        <div className="relative min-h-screen overflow-hidden hide-scrollbar">
            {/* left blob */}
            <Image
                src={blob}
                alt="blob"
                width={120}
                height={120}
                className="absolute w-40 h-36 -left-16 top-56 hidden sm:block"
            />
            {/* top cube left */}
            <Image
                src={cube}
                alt="cube"
                width={197}
                height={207}
                className="absolute w-60 h-64 -top-20 left-96 hidden sm:block"
            />
            {/* bottom cube */}
            <Image
                src={cube}
                alt="cube"
                width={120}
                height={120}
                className="absolute w-72 h-full -bottom-80 left-48 hidden sm:block"
            />
            {/* centre blob */}
            <Image
                src={blob}
                alt="blob"
                width={120}
                height={120}
                className="absolute w-24 h-32 md:top-[30rem] lg:top-[22rem] md:left-80 lg:left-[41rem] hidden sm:block"
            />
            {/* right cube */}
            <Image
                src={cube}
                alt="cube"
                width={197}
                height={207}
                className="absolute w-48 h-64 right-32 md:top-72 lg:top-36 hidden sm:block"
            />
        </div>
    );
}

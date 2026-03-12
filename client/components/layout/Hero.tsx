import Image from "next/image";
import hero from "../../public/hero3.png";
import ButtonWithIcon from "../ui/ButtonWithIcon";

const Hero = () => {
    return (
        <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
            <Image
                src={hero}
                alt="Smart Agriculture Field"
                fill
                priority
                className="object-cover"
            />

            <div className="absolute inset-0 bg-black/5" />

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black/80 tracking-tight">
                    Smart Agricultural <br /> Advancement
                </h1>

                <p className="text-lg md:text-xl text-black/70 max-w-2xl font-light">
                    Empowering farmers with intelligent tools and real-time insights
                    to boost productivity and support sustainable agricultural growth.
                </p>

                <div className="mt-4 flex  sm:flex-row gap-4">

                    <ButtonWithIcon
                        text="Explore Solutions"
                        size="lg"
                        variant="contained"
                    />

                </div>
            </div>
        </div>
    );
};

export default Hero;
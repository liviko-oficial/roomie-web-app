import ImgCampus from "@/modules/campus_selector/components/ImgCampus";

export const Aside = () => {
  return (
    <aside className="row-1 size-full lg:w-full lg:h-fit col-[2] lg:col-[1]  overflow-hidden relative lg:overflow-visible">
      <picture className=" h-full lg:h-[50vh] lg:mx-auto block aspect-square rounded-[9999px] overflow-hidden">
        <ImgCampus />
        {/* <Image
          className="h-full w-fit object-cover object-[-100_center] inline-block"
          src="/img/campus/ciudad_mexico.webp"
          width={1000}
          height={500}
          alt="imagen panoramica del campus"
        /> */}
      </picture>
      <div className="absolute hidden lg:block rounded-4xl bg-primary-50 w-40 h-60 -bottom-4 right-0"></div>
    </aside>
  );
};

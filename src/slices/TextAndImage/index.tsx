import { FC } from "react";
import { Content } from "@prismicio/client";
import { PrismicRichText, PrismicText, SliceComponentProps } from "@prismicio/react";
import { Bounded } from "@/components/Bounded";
import clsx from "clsx";
import { Heading } from "@/components/Heading";
import { ButtonLink } from "@/components/ButtonLink";
import { ParallaxImage } from "./ParallaxImage";
import { SlideIn } from "@/components/SlideIn";

declare module 'react' {
  interface CSSProperties {
    '--index'?: number
  }
}

/**
 * Props for `TextAndImage`.
 */
export type TextAndImageProps = SliceComponentProps<Content.TextAndImageSlice>;

/**
 * Component for "TextAndImage" Slices.
 */
const TextAndImage: FC<TextAndImageProps> = ({ slice, index }) => {
  const theme = slice.primary.theme

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={clsx(
        'sticky top-[calc(var(--index)*2rem)]',
        theme === 'Blue' && 'bg-texture bg-brand-blue text-white',
        theme === 'Orange' && 'bg-texture bg-brand-orange text-white',
        theme === 'Navy' && 'bg-texture bg-brand-navy text-white',
        theme === 'Lime' && 'bg-texture bg-brand-lime text-white',
      )}
      style={{ '--index': index }}
    >
      <div className='grid grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-24'>
        <div className={clsx(
          'flex flex-col items-center gap-8 text-center md:items-start md:text-left',
          slice.variation === 'imageOnLeft' && 'md:order-2'
        )}>
          <SlideIn>
            <Heading size='lg' as='h2'>
              <PrismicText field={slice.primary.heading} />
            </Heading>
          </SlideIn>
          <SlideIn>
            <div className='max-w-md text-lg leading-relaxed'>
              <PrismicRichText field={slice.primary.body} />
            </div>
          </SlideIn>
          <SlideIn>
            <ButtonLink field={slice.primary.button} color={theme === 'Lime' ? 'orange' : 'lime'}>
              {slice.primary.button.text}
            </ButtonLink>
          </SlideIn>
        </div>
        <ParallaxImage
          foregroundImage={slice.primary.foreground_image}
          backgroundImage={slice.primary.background_image}
        />
      </div>
    </Bounded>
  );
};

export default TextAndImage;

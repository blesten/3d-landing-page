import { Metadata } from "next";
import { isFilled, asImageSrc, Content } from "@prismicio/client";
import { SliceComponentProps, SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Page() {
  const client = createClient();
  const page = await client.getSingle("homepage");
  const slices = bundleTextAndImageSlices(page.data.slices)

  return <SliceZone slices={slices} components={{
    ...components,
    text_and_image_bundle: ({ slice }: SliceComponentProps<TextAndImageBundleSlice> ) => (
      <div>
        <SliceZone slices={slice.slices} components={components} />
      </div>
    )
  }} />;
}

export async function generateMetadata(): Promise<Metadata> {
  const client = createClient();
  const page = await client.getSingle("homepage");

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      title: isFilled.keyText(page.data.meta_title)
        ? page.data.meta_title
        : undefined,
      description: isFilled.keyText(page.data.meta_description)
        ? page.data.meta_description
        : undefined,
      images: isFilled.image(page.data.meta_image)
        ? [asImageSrc(page.data.meta_image)]
        : undefined,
    },
  };
}

type TextAndImageBundleSlice = {
  id: string
  slice_type: 'text_and_image_bundle'
  slices: Content.TextAndImageSlice[]
}

function bundleTextAndImageSlices(slices: Content.HomepageDocumentDataSlicesSlice[]) {
  const res: (Content.HomepageDocumentDataSlicesSlice | TextAndImageBundleSlice)[] = []

  for (const slice of slices) {
    if (slice.slice_type !== 'text_and_image') {
      res.push(slice)
      continue
    }

    const bundle = res.at(-1)
    if (bundle?.slice_type === 'text_and_image_bundle') {
      bundle.slices.push(slice)
    } else {
      res.push({
        id: `${slice.id}-bundle`,
        slice_type: 'text_and_image_bundle',
        slices: [slice]
      })
    }
  }

  return res
}
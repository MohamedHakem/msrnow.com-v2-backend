import * as cheerio from 'cheerio';
// import { load } from 'cheerio';

export default async function ArticleRendererSSR({ html }: { html: string | null }) {
  // console.time('ArticleRenderer');

  let styledHtml: string = '';
  if (html !== null) {
    html = html.replace(/&amp;nbsp;/g, ' ').replace(/&ndash;/g, ' ');

    // Replace DOMParser with Cheerio
    const $ = cheerio.load(html);
    // const $ = load(html);

    // Style h1 elements
    $('h1').each(function () {
      $(this).attr('class', 'text-4xl font-bold mb-4');
    });

    // Style h2 elements
    $('h2').each(function () {
      $(this).attr('class', 'text-red-500 underline underline-offset-[6px] text-3lg py-2');
    });

    // Style h3 elements
    $('h3').each(function () {
      $(this).attr('class', 'my-4 font-bold text-2xl');
    });

    // Style h4 elements
    $('h4').each(function () {
      $(this).attr('class', 'text-xl font-semibold my-2');
    });

    // Style p elements
    $('p').each(function () {
      $(this).attr('class', 'mb-4 font-bold text-lg leading-8');
    });

    $('div').each(function () {
      $(this).attr('class', 'font-bold text-lg leading-8');
    });

    // Style anchor (a) elements
    $('a').each(function () {
      $(this).attr('class', 'text-red-500 underline underline-offset-[7px] decoration-dotted hover:text-blue-700');
      $(this).attr('target', '_blank');
    });

    // Style ul elements
    $('ul').each(function () {
      $(this).attr('class', 'list-disc pl-5 mb-4');
    });

    // Style iframe elements
    $('iframe').each(function () {
      const wrapper = $('<div class="bg-black p-0 my-5 w-full inline-block"></div>');
      const newIframe = $(this).clone();
      newIframe.attr('class', 'm-auto w-full');
      wrapper.append(newIframe);
      $(this).replaceWith(wrapper);
    });

    styledHtml = $.html(); // Get the modified HTML

    // console.timeEnd('ArticleRenderer');

    return (
      <div className="flex flex-col w-full gap-2 m-auto" dangerouslySetInnerHTML={{ __html: styledHtml }} />
    );
  }

  return null;
}

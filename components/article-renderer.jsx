'use client';

import { useEffect, useState } from 'react';

const ArticleRenderer = ({ html }) => {
  console.time('ArticleRenderer');
  const [styledHtml, setStyledHtml] = useState('');

  html = html.replace(/&amp;nbsp;/g, ' ');

  useEffect(() => {
    // console.log("html: ", html)
    html.replace('nbsp;', ' ');
    html.replace('&ndash;', ' ');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Style h2 elements
    const h2Elements = doc.querySelectorAll('h2');
    for (let h2 of h2Elements) {
      h2.setAttribute('class', '');
      h2.setAttribute('class', 'text-red-500 underline underline-offset-[6px] text-lg py-2');
    }

    // Style iframe elements
    const iframeElements = doc.querySelectorAll('iframe');
    for (let iframe of iframeElements) {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('class', 'bg-black p-[20px] my-[20px] w-full');
      wrapper.style.display = 'inline-block';
      const newIframe = iframe.cloneNode(true);
      newIframe.setAttribute('class', 'm-auto w-full');
      wrapper.appendChild(newIframe);
      iframe.parentNode.replaceChild(wrapper, iframe);
    }

    // Style p elements
    const pElements = doc.querySelectorAll('p');
    for (let p of pElements) {
      p.setAttribute('class', 'mb-4 font-semibold text-lg');
    }
    setStyledHtml(doc.documentElement.innerHTML);

    // Style h3 elements
    const h3Elements = doc.querySelectorAll('h3');
    for (let h3 of h3Elements) {
      h3.setAttribute('class', 'my-4 font-bold text-2xl');
    }
    setStyledHtml(doc.documentElement.innerHTML);
  }, [html]);

  console.timeEnd('ArticleRenderer');

  return (
    <div
      className="flex flex-col w-full border gap-2 p-2 md:p-4 m-auto"
      dangerouslySetInnerHTML={{ __html: styledHtml }}
    />
  );
};

export default ArticleRenderer;

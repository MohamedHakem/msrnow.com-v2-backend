'use client';
import { increment } from '@/app/actions';
import { ArrowBigUp, ArrowUpSquare, ChevronUpSquare, Heart, Triangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import LoadingDots from '@/components/loading-dots';
import confetti from 'canvas-confetti';

// call increment action in the article's single page, this is just a RSC views counter for display (check leerob's approach)
// I need useEffect to only call the above action once per article page, not with every re-render
// EDIT: I actually need to call this for every time a visitor clicks on an article, not just hard-reload or 1st-time request,
// but also subsequent clicks between articles and soft-navigations with Link comp.. or back/forth browser btns, all of that should count as new view

export default function LikesCounter({ slug, likes }: { slug: string; likes: number | null }) {
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  const addLike = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const originX = (buttonRect.left + buttonRect.right) / 2;
    const originY = (buttonRect.top + buttonRect.bottom) / 2;

    setLoading(true);

    const res: {
      likes: number | null;
      views: number | null;
      shares: number | null;
    } = await increment(slug, 'like');

    confetti({
      particleCount: 50,
      startVelocity: 10,
      spread: 180,
      gravity: 0.3,
      origin: {
        x: originX / window.innerWidth,
        y: originY / window.innerHeight
      }
    });

    setCurrentLikes(res.likes);
    setClicked(true);
    setLoading(false);
  };

  return (
    <Button
      variant={'ghost'}
      onClick={(e) => addLike(e)}
      disabled={loading}
      className={`relative p-1 pr-0 rounded-md flex flex-row items-center min-w-[50px] transition-all duration-500 ease-in-out
      text-[#6b6b6b]/70 hover:text-[#6b6b6b] ${clicked ? 'text-green-500' : ''}`}
    >
      {loading ? (
        <LoadingDots className="bg-black" />
      ) : (
        <>
          {/* <Heart color={'red'} fill={'red'} className="text-zinc-400" /> */}

          <span>
            {/*<!--  SVG Created by Luis Durazo from the Noun Project  -->*/}
            {/* <svg
              id="clap--icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-549 338 100.1 125"
              className="w-6 h-6 text-black"
              fill="#fff"
            >
              <path d="M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z" />
              <path d="M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9" />
            </svg>
          */}
          </span>

          {/* <div
            className="w-0 h-0 
            border-l-8 border-l-transparent
            border-b-8 border-b-black
            border-r-8 border-r-transparent"
          ></div> */}
          {/* {likes !== null ? (
            likes > 50 ? (
              <Triangle
                // color={clicked ? 'green' : '#6b6b6b'}
                // className={clicked ? 'text-green' : 'text-[#6b6b6b]/70'}
                strokeWidth={1}
                // fill={clicked ? 'green' : 'transparent'}
              />
            ) : null
          ) : null}
          {likes !== null ? (
            likes > 45 && likes < 55 ? (
              <ArrowBigUp
                // color={clicked ? 'green' : '#6b6b6b'}
                // className={clicked ? 'text-green' : 'text-[#6b6b6b]/70'}
                strokeWidth={1}
                // fill={clicked ? 'green' : 'transparent'}
              />
            ) : null
          ) : null} */}
          
          <ArrowUpSquare
            // color={clicked ? 'green' : '#6b6b6b'}
            // className={clicked ? 'text-green' : 'text-[#6b6b6b]/70'}
            strokeWidth={1}
            // fill={clicked ? 'green' : 'transparent'}
          />
          {/* {likes !== null ? (
            likes > 30 && likes < 40 ? (
              <ChevronUpSquare
                // color={clicked ? 'green' : '#6b6b6b'}
                // className={clicked ? 'text-green' : 'text-[#6b6b6b]/70'}
                strokeWidth={1}
                // fill={clicked ? 'green' : 'transparent'}
              />
            ) : null
          ) : null} */}
          <span
          className="mr-[2px] pt-[2px]"
            // className={
            //   clicked
            //     ? 'mr-[3px] pt-[2px] text-green-500'
            //     : 'mr-[3px] pt-[2px] text-[#6b6b6b] text-[#6b6b6b]/70 hover:text-[#6b6b6b]'
            // }
          >
            {currentLikes}
          </span>
        </>
      )}
    </Button>
  );
}

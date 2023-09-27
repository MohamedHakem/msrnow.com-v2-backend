'use client';

import { useEffect, useState } from 'react';

export default function Food() {
  const meat = [
    'جلاش باللحمة المفرومة',
    'رقاق لحمة مفرومة',
    'قلاية كبدة',
    'قلاية بانية',
    'رز وكفتة وطحينة وسوداني',
    'حواوشي'
  ];

  const pasta = [
    'كشري',
    'مكرونة وعدس',
    'مكرونة وتونة',
    'مكرونة وبانية',
    'مكرونة بشاميل'
  ];

  const tagen = [
    'طاجن مكرونة وبانية قلاية',
    'طاجن مكرونة وكبدة',
    'طاجن مرونة ولحمة مفرومة'
  ];

  const hoomCook = ['رز بامية وبطاطس محمرة', 'معجنات جبنة ولحمة مفرومة'];

  const [currentMeat, setCurrentMeat] = useState([]);
  const [currentPasta, setCurrentPasta] = useState([]);
  const [currentTagen, setCurrentTagen] = useState([]);

  const randomize = () => {
    const meat1 = meat[Math.floor(Math.random() * meat.length)];
    const meat2 = meat.filter((m) => m != meat1)[
      Math.floor(Math.random() * (meat.length - 1))
    ];
    const pasta1 = pasta[0];
    const pasta2 = pasta.filter((m) => m != pasta1)[
      Math.floor(Math.random() * (pasta.length - 1))
    ];
    const tagen1 = tagen[Math.floor(Math.random() * tagen.length)];
    const tagen2 = tagen.filter((m) => m != tagen1)[
      Math.floor(Math.random() * (tagen.length - 1))
    ];

    setCurrentMeat([meat1, meat2]);
    setCurrentPasta([pasta1, pasta2]);
    setCurrentTagen([tagen1, tagen2]);
  };

  useEffect(() => {
    randomize();
  }, []);

  return (
    <div dir="rtl" className="flex flex-col justify-center gap-4 items-center">
      <button onClick={randomize} className="border p-2">
        اختر لحمة
      </button>
      <div className="m-2 border p-2 w-[300px]">
        <h2 className="border text-center bg-black text-white text-3xl text-bold p-2 mb-2">
          اكل اسبوع
        </h2>

        {/* // 2 days */}
        <div className="bg-red-600 p-2">
          <p> 1- {currentMeat[0]}</p>
          <p> 2- {currentMeat[1]}</p>
        </div>

        {/* // 2 days */}
        <div className="bg-blue-300 p-2">
          <p> 3- {currentPasta[0]}</p>
          <p> 4- {currentPasta[1]}</p>
        </div>

        {/* // 1 days */}
        <div className="bg-amber-500 p-2">
          <p> 5- {currentTagen[0]}</p>
          <p> 6- {currentTagen[1]}</p>
        </div>

        {/* // 2 days */}
        <div className="bg-yellow-500 p-2">
          <p> 7- {hoomCook[0]}</p>
          <p> 8- {hoomCook[1]}</p>
        </div>
      </div>
    </div>
  );
}

// 'use client';

// import CurvedLoop from "./CurvedLoop";


// export default function CurvedText() {
//   return (
//     <div 
//       className="w-screen pt-[5px] mt-[20px] mb-[20px]"
//       style={{ 
//         backgroundColor: 'rgb(249, 249, 249)',
//         height: 'auto'
//       }}
//     >
//          <CurvedLoop
//           marqueeText="Manage ✦ Bookings ✦ With ✦ Ease ✦"
//           speed={3}
//           curveAmount={0}
//           direction="right"
//           interactive={true}
//           className="text-black width-screen"
//         />
      
//     </div>
//   );
// }

'use client';

import CurvedLoop from "./CurvedLoop";

export default function CurvedText() {
  return (
    <div 
      className="w-screen pt-[5px] mt-[20px] mb-[20px]"
      style={{ 
        backgroundColor: 'rgb(249, 249, 249)',
        height: 'auto'
      }}
    >
      <CurvedLoop
        marqueeText="Manage ✦ Bookings ✦ With ✦ Ease ✦"
        speed={3}
        curveAmount={0}
        direction="right"
        interactive={true}
        className="text-black width-screen"
      />
    </div>
  );
}
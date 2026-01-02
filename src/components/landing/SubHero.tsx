// // SubHero.tsx
// import React from "react";
// import InfiniteScroll from "./InfiniteScroll";

// const SubHero: React.FC = () => {
//   const items = [
//     { content: "Text Item 1" },
//     { content: <p>Paragraph Item 2</p> },
//     { content: "Text Item 3" },
//     { content: <p>Paragraph Item 4</p> },
//     { content: "Text Item 5" },
//     { content: <p>Paragraph Item 6</p> },
//     { content: "Text Item 7" },
//     { content: <p>Paragraph Item 8</p> },
//     { content: "Text Item 9" },
//     { content: <p>Paragraph Item 10</p> },
//     { content: "Text Item 11" },
//     { content: <p>Paragraph Item 12</p> },
//     { content: "Text Item 13" },
//     { content: <p>Paragraph Item 14</p> },
//   ];

//   return (
//     <section
//       className="w-full flex flex-col md:flex-row"
//       style={{ backgroundColor: "rgb(249, 249, 249)" }}
//     >
//       {/* Left Section (60%) */}
//       <div className="w-full md:w-3/5 p-6 flex flex-col justify-center">
//         {/* Constraining box */}
//         <div
//           style={{
//             height: "500px",       // or use maxHeight if preferred
//             position: "relative",
//             overflow: "hidden",    // critical to clip moving children
//           }}
//         >
//           <InfiniteScroll
//             items={items}
//             isTilted={true}
//             tiltDirection="left"
//             autoplay={true}
//             autoplaySpeed={0.1}
//             autoplayDirection="down"
//             pauseOnHover={true}
//             // optional: pass width to fit parent
//             width="100%"
//             maxHeight="100%"
//           />
//         </div>
//       </div>

//       {/* Right Section (40%) */}
//       <div className="w-full md:w-2/5 p-6 flex justify-center items-center">
//         <div className="bg-gray-300 w-full h-48 md:h-auto flex items-center justify-center">
//           <span className="text-gray-600">Image or Graphic</span>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default SubHero;

// SubHero.tsx
import React from "react";

const SubHero: React.FC = () => {
  return (
    <section
      className="w-full flex flex-col md:flex-row"
      style={{ backgroundColor: "rgb(249, 249, 249)" }}
    >
      {/* Left Section (60%) */}
      <div className="w-full md:w-3/5 p-6 flex flex-col justify-center">
        {/* Placeholder content (safe + visible) */}
        <div
          className="flex items-center justify-center text-gray-600 text-lg border border-dashed border-gray-300 rounded-lg"
          style={{
            height: "500px",
          }}
        >
          {/* You can replace this later if needed */}
          <span>Additional content goes here</span>
        </div>
      </div>

      {/* Right Section (40%) */}
      <div className="w-full md:w-2/5 p-6 flex justify-center items-center">
        <div className="bg-gray-300 w-full h-48 md:h-auto flex items-center justify-center rounded-lg">
          <span className="text-gray-600">Image or Graphic</span>
        </div>
      </div>
    </section>
  );
};

export default SubHero;

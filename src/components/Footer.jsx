import React from "react";

function Footer() {
  return (
    <>
      <footer className="bottom-0 backdrop-blur-lg footer footer-horizontal footer-center bg-[rgba(49,65,88,0.3)] text-base-content rounded p-8">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by
            [Shifat, Soykot, Basher]
          </p>
        </aside>
      </footer>
    </>
  );
}

export { Footer };

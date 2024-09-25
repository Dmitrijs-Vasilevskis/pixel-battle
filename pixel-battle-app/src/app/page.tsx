import CanvaComponent from "./components/Canvas/Canvas";
import Palette from "./components/Palette/Palette";
import Sidebar from "./components/Sidebar/Sidebar";

export default function Home() {
  return (
    <>
      <div className="main-wrapper">
        <div className="sidebar">
          <Sidebar />
        </div>
        <Palette />
      </div>
      <CanvaComponent />
    </>
  );
}

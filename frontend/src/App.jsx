import { AllPhotos } from "./components";
import NavBar from "./components/NavBar";
import AllRoutes from "./routes/Route";

export default function App() {
  return (
    <main className="bg-gray-200 font-custom">
      <NavBar />
      <AllRoutes />
    </main>
  );
}

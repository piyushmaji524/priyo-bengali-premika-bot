
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Heart } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <div className="text-center max-w-md bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-primary/20">
        <div className="flex justify-center mb-4">
          <Heart className="h-16 w-16 text-lover-DEFAULT animate-heart-beat" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bengali-text">৪০৪</h1>
        <p className="text-xl text-foreground mb-6 bengali-text">
          দুঃখিত! আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।
        </p>
        <a 
          href="/" 
          className="inline-flex items-center gap-2 bg-lover-DEFAULT hover:bg-lover-dark text-white font-medium py-2 px-4 rounded-full transition-colors duration-300"
        >
          <span className="bengali-text">হোমপেজে ফিরে যান</span>
        </a>
      </div>
    </div>
  );
};

export default NotFound;

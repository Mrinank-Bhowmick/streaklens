import { ArrowUp, Search } from "flowbite-react-icons/outline";
import { useState, useRef } from "react";

interface SearchbarProps {
  onSubmit: (text: string) => void;
}

const Searchbar: React.FC<SearchbarProps> = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const textarea = textareaRef.current as HTMLTextAreaElement | null;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim()) {
        onSubmit(text);
        setText("");
      }
    }
  };

  const handleButtonClick = () => {
    if (text.trim()) {
      onSubmit(text);
      setText("");
    }
  };

  return (
    <div className="flex bg-slate-700 items-center p-2 rounded-2xl gap-2 w-full">
      <Search />
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full p-2 resize-none overflow-y-auto text-white bg-slate-700 border-none outline-none focus:outline-none focus:ring-0"
        style={{ minHeight: "44px", height: "44px", maxHeight: "200px" }}
        placeholder="Ask Anything..."
      />
      <div
        className="bg-slate-500 rounded-full p-2 cursor-pointer"
        onClick={handleButtonClick}
      >
        <ArrowUp />
      </div>
    </div>
  );
};

export default Searchbar;

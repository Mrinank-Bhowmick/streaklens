import { ArrowRight, CloseCircle } from "flowbite-react-icons/outline";
import React, { useState } from "react";

type ModalProps = {
  article: NewsData;
  setSelectArticle: React.Dispatch<React.SetStateAction<string>>;
  selectArticle: string;
  setPageURL: React.Dispatch<React.SetStateAction<string | null>>;
};
const Modal = ({
  article,
  selectArticle,
  setSelectArticle,
  setPageURL,
}: ModalProps) => {
  const [showModal, setShowModal] = useState(false);
  //const [selectArticle, setSelectArticle] = useState("Select Article");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCategory, setPageCategory] = useState<string>("");

  const MyModal = () => {
    return (
      <>
        <div className="fixed inset-0 md:top-[14px] md:right-0 md:left-64 md:bottom-0 bg-black bg-opacity-30 backdrop-blur-sm text-white flex  items-center justify-center">
          <div className="flex flex-col h-[70vh] w-[70vh] bg-slate-700 rounded-3xl p-5 border-2">
            <button
              onClick={() => setShowModal(false)}
              className="flex justify-end"
            >
              <CloseCircle />
            </button>
            {pageNumber == 1 ? (
              <div className="flex flex-col items-center justify-between h-full">
                <div className="flex justify-center text-2xl">
                  Select Category
                </div>

                {Object.keys(article).map((category, index) => (
                  <div
                    onClick={() => {
                      setPageNumber(2);
                      setPageCategory(category);
                    }}
                    className="flex justify-center rounded-3xl bg-slate-600 w-full p-2 hover:bg-slate-500 cursor-pointer"
                    key={category}
                  >
                    {category}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-start justify-end h-[60vh]">
                <div className="flex items-center justify-center text-xl p-2">
                  Select Any One Article from {pageCategory} Category
                </div>
                <div className=" flex flex-col gap-2 overflow-y-auto">
                  {article[pageCategory as keyof NewsData].map(
                    (element, index) => {
                      return (
                        <div
                          className="rounded-3xl bg-slate-600 hover:bg-slate-500 p-2 cursor-pointer"
                          onClick={() => {
                            setSelectArticle(
                              element.title.substring(0, 20) + "..."
                            );
                            setPageURL(element.link);
                            setShowModal(false);
                          }}
                          key={index}
                        >
                          {element.title}
                        </div>
                      );
                    }
                  )}
                </div>
                <button
                  onClick={() => setPageNumber(1)}
                  className="p-2 bg-green-500 rounded-2xl"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 bg-green-500 rounded-xl md:w-[35vh] w-[35vh] flex ml-4 mb-2"
      >
        <ArrowRight />
        {selectArticle}
      </button>
      {showModal ? <MyModal /> : ""}
    </>
  );
};

export default Modal;

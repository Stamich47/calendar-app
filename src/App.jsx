import Calendar from "./components/Calendar";
import PostInput from "./components/PostInput";
import "./styles.css";

function App() {
  return (
    <>
      <div className="mx-2 mt-5">
        <Calendar />
        <div className="d-flex justify-content-center">
          <PostInput />
        </div>
      </div>
    </>
  );
}

export default App;

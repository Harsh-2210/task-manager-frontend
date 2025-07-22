import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./componets/Register";
import Login from "./componets/Login";
import TaskList from "./componets/TaskList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<TaskList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

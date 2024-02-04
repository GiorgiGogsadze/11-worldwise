import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth === undefined) throw new Error("auth context is undefined here");
  return auth;
};
const users = [
  {
    name: "giorgi",
    email: "giorgi@react.ge",
    password: "react2024",
    avatar:
      "https://scontent.ftbs4-2.fna.fbcdn.net/v/t39.30808-6/332331763_737421527799188_3897704665817494149_n.jpg?stp=cp6_dst-jpg&_nc_cat=108&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeEZ6IkbzXp89DEzIKzdeJxD43QytPO1cSfjdDK087VxJ_HOjXfEa0N3XSJtm01Q0Ik1odXze4QIcwTRWnuxjN6y&_nc_ohc=Vk-JYRZv9doAX-tdg1C&_nc_ht=scontent.ftbs4-2.fna&oh=00_AfC0R5HViSpaMXDaJ6qOik8P9FipB40-V16M5HXZW9Zo9w&oe=65C3C7C5",
  },
];

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const login = (email, password) => {
    try {
      const user = users.filter((el) => el.email === email)[0];
      if (!user) throw new Error("email couldn't find");
      if (user.password !== password) throw new Error("Password is incorrect");
      setCurrentUser(user);
    } catch (err) {
      console.log(err.message);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };

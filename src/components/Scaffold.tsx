import Background from "./Background";

interface IScaffoldProp {
  children: React.ReactNode;
}

const Scaffold: React.FC<IScaffoldProp> = ({ children }) => {
  return (
    <>
      <>{children}</>
      {/* <Background /> */}
    </>
  );
};

export default Scaffold;

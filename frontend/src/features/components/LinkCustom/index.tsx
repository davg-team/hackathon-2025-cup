import { NavLink } from "react-router-dom";

const LinkCustom = ({
  children,
  to,
  classN
}: {
  children: React.ReactNode;
  to: string;
  classN?: string;
}) => {
  return (
    <NavLink
      className={`g-button g-button_size_l g-button_pin_round-round ${classN}`}
      to={to}
    >
      {children}
    </NavLink>
  );
};

export default LinkCustom;
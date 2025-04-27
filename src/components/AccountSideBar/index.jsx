import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { path: "/accountInform/profile", label: "Hồ sơ cá nhân" },
  { path: "/accountInform/changePassword", label: "Đổi mật khẩu" },
  { path: "/accountInform/address", label: "Địa chỉ" },
];
const AccountSideBar = () => {
  const location = useLocation();

  return (
    <>
      <h2
        style={{
          fontSize: "1.8rem",
          width: "100%",
        }}
      >
        Thông tin tài khoản
      </h2>

      {menuItems.map((item) => (
        <Link
          to={item.path}
          key={item.path}
          style={{
            textDecoration: "none",
            color:
              location.pathname === item.path ? "black" : "var(--text-color)",
            fontWeight: location.pathname === item.path ? "bold" : "normal",
            fontSize: location.pathname === item.path ? "16px" : "14px",
            lineHeight: location.pathname === item.path ? "24px" : "20px",
            padding: "8px 0 8px 30px",
            display: "block",
          }}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
};

export default AccountSideBar;

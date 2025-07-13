import { useState } from 'react';
import styles from './Sidebar.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Landmark,
  Wine,
  Calendar,
  Utensils,
  Gift,
  ChartArea,
  LogOut,
  UserCheck,
} from 'lucide-react';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { ReceiptLong } from '@mui/icons-material';

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { role, logout } = useAuth();

  const rawMenuItems = [
    { path: 'tai-khoan', icon: <UserCheck size={26} />, label: 'Tài khoản', roles: ['Admin'] },
    { path: 'sanh-tiec', icon: <Landmark size={26} />, label: 'Sảnh tiệc' },
    { path: 'tiec-cuoi', icon: <Wine size={26} />, label: 'Tiệc cưới' },
    { path: 'lich-su-kien/tuan', icon: <Calendar size={26} />, label: 'Lịch sự kiện' },
    { path: 'mon-an', icon: <Utensils size={26} />, label: 'Món ăn' },
    { path: 'dich-vu', icon: <Gift size={26} />, label: 'Dịch vụ' },
    { path: 'hoa-don', icon: <ReceiptLong sx={{ width: '28px', height: '28px'}}/>, label: 'Hóa đơn' },
    { path: 'bao-cao', icon: <ChartArea size={26} />, label: 'Báo cáo', roles: ['Admin'] },
  ];

  const menuItems = rawMenuItems.filter(item =>
    !item.roles || (role !== null && item.roles.includes(role))
  );

  const handleLogOut = () => {
    logout();
    navigate("/login")
  }

  return (
    <nav className={`${styles.sidebar} ${!expanded ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.header}>
        <h1 className={`${styles.headerText} ${!expanded ? styles.collapsed : ''}`}>Welcome</h1>
        <IconButton className={styles.expandButton} onClick={() => setExpanded((curr) => !curr)}>
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </div>

      <div className={styles.sidebarList}>
        {menuItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <Link
              key={item.path}
              to={`/${item.path}`}
              className={`${styles.sidebarListItem} ${isActive ? styles.activeTab : ''}`}
            >
              {item.icon}
              <div className={`${styles.sidebarListItemText} ${!expanded ? styles.collapsed : ''}`}>
                {item.label}
              </div>
              {!expanded && <div className={styles.tooltip}>{item.label}</div>}
            </Link>
          );
        })}

        <Box className={styles.sidebarListItem} onClick={handleLogOut}>
          <LogOut />
          <div className={`${styles.sidebarListItemText} ${!expanded ? styles.collapsed : ''}`}>
            Đăng xuất
          </div>
          {!expanded && <div className={styles.tooltip}>Đăng xuất</div>}
        </Box>
      </div>
    </nav>
  );
}

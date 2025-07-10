import { useEffect, useState } from "react";
import {
  getUnapprovedAccounts,
  approveAccount,
  deleteAccount,
} from "../../apis/taikhoanApis.ts";
import {
  Button,
  Card,
  Typography,
  Box,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface TaiKhoan {
  _id: string;
  TenDangNhap: string;
  HoTen: string;
  LoaiTK: string;
  DaDuyet: boolean;
}

export default function AccountApproval() {
  const [accounts, setAccounts] = useState<TaiKhoan[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    const data = await getUnapprovedAccounts();
    setAccounts(data);
  };

  const handleApprove = async (id: string) => {
    await approveAccount(id);
    fetchAccounts();
  };

  const handleRejectConfirm = (id: string) => {
    setSelectedAccountId(id);
    setOpenDialog(true);
  };

  const handleReject = async () => {
    if (selectedAccountId) {
      await deleteAccount(selectedAccountId);
      setOpenDialog(false);
      setSelectedAccountId(null);
      fetchAccounts();
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setSelectedAccountId(null);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Xác nhận tài khoản nhân viên
      </Typography>

      {accounts.length === 0 ? (
        <Typography>Không có tài khoản chờ duyệt.</Typography>
      ) : (
        accounts.map((acc) => (
          <Card key={acc._id} sx={{ mb: 2, p: 2 }}>
            <Typography>
              <strong>Họ tên:</strong> {acc.HoTen}
            </Typography>
            <Typography>
              <strong>Tên đăng nhập:</strong> {acc.TenDangNhap}
            </Typography>
            <Stack direction="row" spacing={2} mt={1}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleApprove(acc._id)}
              >
                ✅ Duyệt
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleRejectConfirm(acc._id)}
              >
                ❌ Từ chối
              </Button>
            </Stack>
          </Card>
        ))
      )}

      {/* Dialog xác nhận từ chối */}
      <Dialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Xác nhận từ chối</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn từ chối và xoá tài khoản này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Huỷ</Button>
          <Button onClick={handleReject} color="error">
            Xoá tài khoản
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

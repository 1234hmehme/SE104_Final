import { useEffect, useState } from "react";
import {
  getUnapprovedAccounts,
  getAllApprovedAccounts,
  approveAccount,
  deleteAccount,
} from "../../apis/taikhoanApis.ts";
import {
  Button,
  Card,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
} from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";

interface TaiKhoan {
  _id: string;
  TenDangNhap: string;
  HoTen: string;
  LoaiTK: string;
  DaDuyet: boolean;
}

export default function AccountApproval() {
  const [approvedAccounts, setApprovedAccounts] = useState<TaiKhoan[]>([]);
  const [unapprovedAccounts, setUnapprovedAccounts] = useState<TaiKhoan[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  useEffect(() => {
    fetchUnapprovedAccounts();
    fetchApprovedAccounts();
  }, []);

  const fetchUnapprovedAccounts = async () => {
    const data = await getUnapprovedAccounts();
    setUnapprovedAccounts(data);
  };

  const fetchApprovedAccounts = async () => {
    const data = await getAllApprovedAccounts();
    setApprovedAccounts(data);
  };

  const handleApprove = async (id: string) => {
    await approveAccount(id);
    fetchUnapprovedAccounts();
    fetchApprovedAccounts();
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
      fetchUnapprovedAccounts();
      fetchApprovedAccounts();
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setSelectedAccountId(null);
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: "100%",
      overflow: 'auto',
      backgroundColor: '#fff',
      borderRadius: '15px',
      padding: '20px',
    }}>
      <Typography sx={{
        userSelect: "none",
        fontWeight: "bold",
        fontSize: "32px",
        margin: " 20px",
      }}>
        Quản lý tài khoản
      </Typography>

      <Box sx={{
        display: 'flex',
        width: '100%',
        gap: '40px'
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 4,
        }}>
          <Box sx={{
            display: 'flex',
            gap: '5px',
            marginLeft: "20px",
            marginBottom: '20px',
          }}>
            <Typography sx={{
              userSelect: "none",
              fontSize: "18px",
            }}>
              Danh sách tài khoản nhân viên:
            </Typography>
            <Typography sx={{
              userSelect: "none",
              fontWeight: "bold",
              fontSize: "18px",
            }}>
              ({approvedAccounts.length})
            </Typography>
          </Box>

          <TableContainer component={Paper} sx={{
            background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><b>Stt</b></TableCell>
                  <TableCell align="center"><b>Tên đăng nhập</b></TableCell>
                  <TableCell align="center"><b>Họ tên</b></TableCell>
                  <TableCell align="center"><b>Hành động</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedAccounts.map((acc, index) => (
                  <TableRow key={index}>
                    {/* STT */}
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell align="center">
                      {acc.TenDangNhap}
                    </TableCell>
                    <TableCell align="center">
                      {acc.HoTen}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" sx={{ color: '#ff0000' }}
                        onClick={() => handleRejectConfirm(acc._id)}>
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 3,
        }}>
          <Box sx={{
            display: 'flex',
            gap: '5px',
            marginLeft: "20px",
            marginBottom: '20px',
          }}>
            <Typography sx={{
              userSelect: "none",
              fontSize: "18px",
            }}>
              Chờ duyệt:
            </Typography>
            <Typography sx={{
              userSelect: "none",
              fontWeight: "bold",
              fontSize: "18px",
            }}>
              ({unapprovedAccounts.length})
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}>
            {unapprovedAccounts.map((acc) => (
              <Card key={acc._id} sx={{
                p: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Typography>
                    <strong>Họ tên:</strong> {acc.HoTen}
                  </Typography>
                  <Typography>
                    <strong>Tên đăng nhập:</strong> {acc.TenDangNhap}
                  </Typography>
                </Box>

                <Box sx={{
                  display: 'flex',
                  gap: '10px'
                }}>
                  <Button
                    variant="contained"
                    onClick={() => handleRejectConfirm(acc._id)}
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      borderRadius: '50px',
                      textTransform: "none",
                      color: 'black',
                      background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                    }}
                  >
                    Từ chối
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleApprove(acc._id)}
                    sx={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      paddingX: '25px',
                      borderRadius: '50px',
                      textTransform: "none",
                      backgroundColor: '#4880FF'
                    }}
                  >
                    Duyệt
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Dialog xác nhận từ chối */}
      <Dialog open={openDialog} onClose={handleCancel}
        sx={{
          '& .MuiPaper-root': {
            padding: '20px 4px',
            borderRadius: '15px'
          }
        }}
      >
        <DialogTitle sx={{
          alignSelf: 'center',
          fontWeight: 'bold'
        }}>
          Xác nhận từ chối
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn xoá tài khoản này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{
          alignSelf: 'center',
        }}>
          <Button onClick={handleCancel}
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              color: 'black',
              textTransform: "none",
            }}
          >
            Huỷ
          </Button>
          <Button variant="contained" onClick={handleReject} color="error"
            sx={{
              fontSize: "14px",
              fontWeight: "bold",
              borderRadius: '8px',
              textTransform: "none",
            }}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
}

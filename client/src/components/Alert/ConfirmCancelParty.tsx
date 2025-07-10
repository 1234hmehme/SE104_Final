import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

export default function ConfirmCancel({ 
    open, 
    onClose, 
    onConfirm 
}: {
    open: boolean,
    onClose: () => void,
    onConfirm: () => void
}) {
    return (
        <Dialog open={open} onClose={onClose}
            sx={{
                '& .MuiPaper-root': {
                    padding: '20px 4px',
                    borderRadius: '15px'
                }
            }}
        >
            <DialogTitle>
                Xác nhận hủy tiệc cưới này? Hủy tiệc sẽ mất tiền cọc!
            </DialogTitle>

            <DialogActions sx={{
                alignSelf: 'center',
            }}>
                <Button onClick={onClose}
                    sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: 'black',
                        textTransform: "none",
                    }}
                >
                    Không
                </Button>
                <Button variant="contained" color="error" onClick={onConfirm}
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
    );
}

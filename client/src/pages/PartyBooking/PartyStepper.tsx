import { Stepper, Step, StepLabel, Box, Button } from "@mui/material";
import { useState } from "react";
import StepCustomerInfo from "./steps/StepCustomerInfo";
import StepHall from "./steps/StepHall";
import StepFood from "./steps/StepFood";
import StepService from "./steps/StepService";
import StepConfirm from "./steps/StepConfirm";
import { useFormContext } from "react-hook-form";
import { IFoodBooking } from "../../interfaces/food.interface";

const steps = [
  "Thông tin khách hàng",
  "Chọn sảnh",
  "Chọn món ăn",
  "Chọn dịch vụ",
  "Xác nhận hóa đơn",
];

export default function PartyStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const methods = useFormContext();
  const { trigger, getValues, setError, clearErrors } = methods;

  const handleNext = async () => {
    // Validate các trường của step hiện tại trước khi next
    let fieldsToValidate: string[] = [];
    switch (activeStep) {
      case 0:
        fieldsToValidate = ["groom", "bride", "phone"];
        break;
      case 1:
        fieldsToValidate = ["date", "shift", "hall", "tables", "reserveTables"];
        break;
      case 2:
        fieldsToValidate = ["foods"];
        break;
      // Các bước khác nếu cần
      default:
        fieldsToValidate = [];
    }
    if (fieldsToValidate.length > 0) {
      const valid = await trigger(fieldsToValidate);
      if (!valid) return;
    }

    const { tables, reserveTables, hall, foods } = getValues();
    // Kiểm tra riêng cho các step
    if (activeStep === 1) {
      const totalTables = Number(tables) + Number(reserveTables);
      
      if (totalTables <= 0) {
        setError("tables", {
          type: "manual",
          message: "Tổng số bàn phải lớn hơn 0"
        });
        setError("reserveTables", {
          type: "manual",
          message: "Tổng số bàn phải lớn hơn 0",
        });
        return;
      } else if (totalTables > hall.maxTable) {
        setError("tables", {
          type: "manual",
          message: "Tổng số bàn vượt quá số bàn tối đa của sảnh",
        });
        setError("reserveTables", {
          type: "manual",
          message: "Tổng số bàn vượt quá số bàn tối đa của sảnh",
        });
        return;
      } else {
        clearErrors("tables");
        clearErrors("reserveTables")
      }
    }

    if (activeStep === 2) {
      const tablePrice = foods.reduce((sum: number, item: IFoodBooking) => sum + item.price, 0);

      if (tablePrice < hall.minTablePrice) {
        setError("foods", {
          type: "manual",
          message: "Chưa đạt đơn giá bàn tối thiểu",
        });
        return;
      } else {
        clearErrors("foods");
      }
    }


    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const renderStep = () => {
    switch (activeStep) {
      case 0: return <StepCustomerInfo />;
      case 1: return <StepHall />;
      case 2: return <StepFood />;
      case 3: return <StepService />;
      case 4: return <StepConfirm />;
      default: return null;
    }
  };

  return (
    <Box sx={{
      display: "flex",
      height: '100%',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <Stepper
        activeStep={activeStep}
        orientation="horizontal"
        sx={{
          width: "100%",
          backgroundColor: '#fff',
          borderRadius: '20px',
          padding: '15px 10px',
          '& .MuiStepLabel-label.Mui-active': {
            color: '#4880FF'
          },
          '& .MuiStepLabel-label': {
            fontSize: 16
          },
          '& .MuiStepIcon-root': {
            color: "#a5bed4",
            '&.Mui-active': {
              color: '#4880FF'
            },
            '&.Mui-completed': {
              color: '#4880FF'
            },
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 20px',
        backgroundColor: '#fff',
        borderRadius: '20px',
        minHeight: 0,
      }}>
        <Box sx={{ flex: 1, overflowY: "auto", pr: 1, }}>
          {renderStep()}
        </Box>

        <Box sx={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          padding: '10px',
          paddingBottom: 0,
          gap: '15px'
        }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{
              mr: 2,
              textTransform: "none",
            }}
          >
            Quay lại
          </Button>
          {activeStep < steps.length - 1 && (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: '8px',
                backgroundColor: "#4880FF",
                textTransform: "none",
              }}
            >
              Tiếp theo
            </Button>
          )}
        </Box>
      </Box>
    </Box >
  );
}
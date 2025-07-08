import { useForm, FormProvider } from "react-hook-form";
import PartyStepper from "./PartyStepper";

export default function PartyBooking() {
    const methods = useForm({
        defaultValues: {
            groom: "",
            bride: "",
            phone: "",
            date: "",
            shift: "",
            hall: "",
            tables: 0,
            reserveTables: 0,
            foods: [],
            services: [],
        },
        mode: "onTouched", // để trigger validate chính xác
    });
    return (
        <FormProvider {...methods}>
            <PartyStepper />
        </FormProvider>
    );
}

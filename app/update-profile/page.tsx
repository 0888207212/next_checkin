"use client";

import FormUpdateProfile from "@/components/FormUpdateProfile/FormUpdateProfile";
import apiCompleteProfile from "@/api/complete-profile";
import { showToastMessage } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { completeProfile } from "@/redux/features/auth-slice";
import { AppDispatch } from "@/redux/store";

const UpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const updateProfile = async (data: any) => {
    try {
      const response: any = await apiCompleteProfile.updateProfile(data);
      if (response.status === 200) {
        dispatch(completeProfile(response.data.user));
        showToastMessage("Update profile success", "success");
        router.push("/user-detail");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container mx-auto">
      <FormUpdateProfile handleForm={updateProfile} />
    </div>
  );
};

export default UpdateProfile;

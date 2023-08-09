"use client";

import { CompleteProfile } from "@/interfaces/profile";
import { useRouter } from "next/navigation";
import apiCompleteProfile from "@/api/complete-profile";
import { showToastMessage } from "@/utils/helper";

import FormCompleteProfile from "@/components/FormCompleteProfile/FormCompleteProfile";

const CompleteProfile = () => {
  const router = useRouter();

  const completeProfile = async (data: CompleteProfile) => {
    try {
      const response = await apiCompleteProfile.updateProfile(data);
      if (response.status === 200) {
        showToastMessage("Complete profile success", "success");
        router.push("/checkin");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between py-10 sm:p-12 h-[calc(100vh-231px)]">
      <FormCompleteProfile handleForm={completeProfile} />
    </div>
  );
};

export default CompleteProfile;

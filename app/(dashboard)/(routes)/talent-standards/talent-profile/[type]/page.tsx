"use client";

import { useParams } from "next/navigation";
import ProfileDetail from "../../profile-detail";

/**
 * 人才履历详情页面
 * @returns {React.JSX.Element} 人才履历详情页面组件
 */
export default function TalentDetailPage() {
  const params = useParams();
  const type = params.type as string;
  
  return <ProfileDetail talentId={type} />;
} 
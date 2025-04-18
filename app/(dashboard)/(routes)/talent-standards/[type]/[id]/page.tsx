"use client";

import React from "react";
import ProfileDetail from "../../profile-detail";

/**
 * 人才详情页面路由组件
 * @returns {React.JSX.Element} 人才详情页面
 */
export default function TalentDetailPage({ params }: { params: { id: string } }) {
  return <ProfileDetail talentId={params.id} />;
} 
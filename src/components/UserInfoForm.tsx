'use client';

import { useState } from 'react';
import { UserInfo } from '@/types/saju';

interface UserInfoFormProps {
  onSubmit: (userInfo: UserInfo) => void;
  isLoading?: boolean;
}

export default function UserInfoForm({ onSubmit, isLoading = false }: UserInfoFormProps) {
  const [formData, setFormData] = useState<UserInfo>({
    birthDate: '1997-05-07',
    birthTime: '21:00',
    gender: '남'
  });

  const [errors, setErrors] = useState<Partial<UserInfo>>({});

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 에러 상태 초기화
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserInfo> = {};

    if (!formData.birthDate) {
      newErrors.birthDate = '생년월일을 입력해주세요.';
    }

    if (!formData.birthTime) {
      newErrors.birthTime = '출생시간을 입력해주세요.';
    }

    if (!formData.gender) {
      newErrors.gender = '성별을 선택해주세요.' as any;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-fuchsia-500 text-white p-6">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🔮</div>
          <div>
            <h1 className="text-xl font-bold">사주 분석</h1>
            <p className="text-sm opacity-90">생년월일시를 입력하면 정확한 만세력을 계산해드립니다</p>
          </div>
        </div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* 생년월일 */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-black mb-2">
            생년월일
          </label>
          <input
            type="date"
            id="birthDate"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black ${
              errors.birthDate ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
          )}
        </div>

        {/* 출생시간 */}
        <div>
          <label htmlFor="birthTime" className="block text-sm font-medium text-black mb-2">
            출생시간
          </label>
          <input
            type="time"
            id="birthTime"
            value={formData.birthTime}
            onChange={(e) => handleInputChange('birthTime', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black ${
              errors.birthTime ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          {errors.birthTime && (
            <p className="mt-1 text-sm text-red-600">{errors.birthTime}</p>
          )}
        </div>

        {/* 성별 */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            성별
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="남"
                checked={formData.gender === '남'}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-black">남성</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="여"
                checked={formData.gender === '여'}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-black">여성</span>
            </label>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              분석 중...
            </div>
          ) : (
            '🔮 사주 분석하기'
          )}
        </button>
      </form>

      {/* 안내 메시지 */}
      <div className="px-6 pb-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-purple-500 text-lg">💡</div>
            <div>
              <h3 className="font-semibold text-purple-700 text-sm mb-1">분석 안내</h3>
              <p className="text-xs text-purple-600 leading-relaxed">
                정확한 생년월일시를 입력하시면 만세력 기반으로 정확한 사주를 계산하여 
                당신의 성격과 특성을 분석해드립니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

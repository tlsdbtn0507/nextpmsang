'use client';

import { useState } from 'react';
import { UserInfo } from '@/types/saju';

interface PMDiagnosisFormProps {
  onSubmit: (userInfo: UserInfo) => void;
  onPreview: () => void;
  isLoading?: boolean;
  isTransitioning?: boolean;
}

export default function PMDiagnosisForm({ onSubmit, onPreview, isLoading = false, isTransitioning = false }: PMDiagnosisFormProps) {
  const [formData, setFormData] = useState<UserInfo>({
    birthDate: '',
    birthTime: '12:00',
    gender: '남',
    address: ''
  });

  const [name, setName] = useState('김철수');

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={`bg-white p-6 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {/* 제목 섹션 */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-purple-500 text-xl">✨</div>
          <h2 className="text-2xl font-bold text-gray-800">PM 사주 진단</h2>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          생년월일과 태어난 시간을 입력하여 당신의 PM 적성을 확인하세요
        </p>
        <div className="w-full h-px bg-purple-200"></div>
      </div>

      {/* 폼 필드들 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이름과 성별 - 2열 레이아웃 */}
        <div className={`grid grid-cols-2 gap-4 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 (선택)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-pink-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성별
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className="w-full px-3 py-2 bg-pink-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
            >
              <option value="남">남성</option>
              <option value="여">여성</option>
            </select>
          </div>
        </div>

        {/* 생년월일 */}
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <span>📅</span>
              생년월일 *
            </div>
          </label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) => handleInputChange('birthDate', e.target.value)}
            className="w-full px-3 py-2 bg-pink-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-black"
            required
          />
        </div>

        {/* 출생시간 */}
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <span>🕐</span>
              태어난 시간
            </div>
          </label>
          <input
            type="time"
            value={formData.birthTime}
            onChange={(e) => handleInputChange('birthTime', e.target.value)}
            className="w-full px-3 py-2 bg-pink-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-black"
          />
        </div>

        {/* 출생지역 */}
        <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            태어난 지역 (선택)
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            placeholder="예: 서울"
            className="w-full px-3 py-2 bg-pink-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-black"
          />
        </div>

        {/* 안내 메시지 */}
        <p className="text-xs text-gray-500">
          * 정확한 시간을 모르시면 12:00 (정오)로 설정됩니다
        </p>

        {/* 액션 버튼들 */}
        <div className={`flex gap-3 pt-4 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          <button
            type="submit"
            disabled={isLoading || !formData.birthDate}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
          >
            <span>✨</span>
            사주·PM 리포트 생성
          </button>
          <button
            type="button"
            onClick={onPreview}
            className="flex-1 bg-white border-2 border-purple-200 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:border-purple-300 hover:scale-[1.02] hover:bg-purple-50 transition-all duration-200"
          >
            미리보기
          </button>
        </div>
      </form>
    </div>
  );
}

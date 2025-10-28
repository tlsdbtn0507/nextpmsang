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
    gender: '남'
  });

  const [name, setName] = useState('김철수');
  const [ampm, setAmpm] = useState('오후');
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');

  // AM/PM과 시간 입력을 결합하여 birthTime 업데이트
  const updateBirthTime = (newAmpm: string, newHour: string, newMinute: string) => {
    // 유효성 검사
    const h = parseInt(newHour);
    const m = parseInt(newMinute);
    
    if (isNaN(h) || h < 1 || h > 12) {
      alert('시간은 1시부터 12시까지만 입력 가능합니다.');
      return;
    }
    
    if (isNaN(m) || m < 0 || m > 59) {
      alert('분은 0분부터 59분까지만 입력 가능합니다.');
      return;
    }
    
    setAmpm(newAmpm);
    setHour(newHour);
    setMinute(newMinute);
    
    // 24시간 형식으로 변환
    let finalHours = h;
    
    if (newAmpm === '오전') {
      if (h === 12) finalHours = 0;
      else finalHours = h;
    } else {
      if (h !== 12) finalHours = h + 12;
    }
    
    const finalTime = `${String(finalHours).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    handleInputChange('birthTime', finalTime);
  };

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
            min="1900-01-01"
            max={new Date().toISOString().split('T')[0]}
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
          <div className="flex gap-2">
            {/* 오전/오후 선택 */}
            <select
              value={ampm}
              onChange={(e) => updateBirthTime(e.target.value, hour, minute)}
              className="w-1/4 px-3 py-2 bg-pink-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-black"
            >
              <option value="오전">오전</option>
              <option value="오후">오후</option>
            </select>
            {/* 시 입력 */}
            <input
              type="number"
              value={hour}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
                  setHour(value);
                  updateBirthTime(ampm, value || '1', minute);
                }
              }}
              placeholder="시"
              min="1"
              max="12"
              className="w-1/4 px-3 py-2 bg-pink-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-black"
            />
            {/* 분 입력 */}
            <input
              type="number"
              value={minute}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
                  setMinute(value);
                  updateBirthTime(ampm, hour, value || '0');
                }
              }}
              placeholder="분"
              min="0"
              max="59"
              className="w-1/4 px-3 py-2 bg-pink-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 text-black"
            />
            <span className="w-1/4 px-3 py-2 text-gray-500 flex items-center justify-center text-sm">
              시
            </span>
          </div>
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
        </div>
      </form>
    </div>
  );
}

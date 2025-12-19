import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createAppeal } from '../../api/appeals';
import './style.css';

const AppealsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    language: i18n.language || 'uz', // Текущий язык интерфейса
    subject: '',
    message: '',
    is_anonymous: false,
  });
  
  // Обновляем язык при смене языка интерфейса
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      language: i18n.language || 'uz'
    }));
  }, [i18n.language]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      // Проверяем что поля заполнены
      if (!formData.subject || formData.subject.trim() === '') {
        setError(t('appeals.error_no_subject'));
        setLoading(false);
        return;
      }
      
      if (!formData.message || formData.message.trim() === '') {
        setError(t('appeals.error_no_message'));
        setLoading(false);
        return;
      }
      
      await createAppeal(formData);
      setSuccess(true);
      
      // Очистка формы
      setFormData({
        language: i18n.language || 'uz',
        subject: '',
        message: '',
        is_anonymous: false,
      });
      
      // Через 3 секунды вернуться на главную
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (error) {
      console.error('Ошибка отправки обращения:', error);
      setError(error.response?.data?.detail || t('appeals.error_general'));
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="appeals-page">
        <div className="container">
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h2>{t('appeals.success_title')}</h2>
            <p>{t('appeals.success_message')}</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              {t('appeals.back_to_home')}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="appeals-page">
      <div className="container">
        <div className="appeals-header">
          <h1>{t('appeals.title')}</h1>
          <p>{t('appeals.description')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="appeal-form">
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          {/* Чекбокс анонимности */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_anonymous"
                checked={formData.is_anonymous}
                onChange={handleChange}
              />
              <span>{t('appeals.anonymous')}</span>
            </label>
            <small className="form-hint">{t('appeals.anonymous_hint')}</small>
          </div>
          
          {/* Тема обращения */}
          <div className="form-group">
            <label htmlFor="subject">
              {t('appeals.subject')} <span className="required">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder={t('appeals.subject_placeholder')}
              className="form-control"
              required
            />
          </div>
          
          {/* Сообщение */}
          <div className="form-group">
            <label htmlFor="message">
              {t('appeals.message')} <span className="required">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={t('appeals.message_placeholder')}
              className="form-control"
              rows="8"
              required
            />
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? t('appeals.sending') : t('appeals.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppealsPage;


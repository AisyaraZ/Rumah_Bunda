import React from 'react';

export default function UserAvatar({
  user,
  size = 40,
  className = '',
  style = {},
  showBorder = false
}) {
  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const isImageAvatar =
    user?.avatar &&
    (user.avatar.startsWith('data:image/') ||
      user.avatar.startsWith('http') ||
      user.avatar.startsWith('/'));

  const baseStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxShadow: showBorder ? '0 2px 8px rgba(85, 127, 99, 0.25)' : 'none',
    border: showBorder ? '3px solid #ffffff' : 'none',
    ...style
  };

  if (isImageAvatar) {
    return (
      <div className={`user-avatar-container ${className}`} style={baseStyle}>
        <img
          src={user.avatar}
          alt={user?.full_name || 'Foto Profil'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`user-avatar-initials ${className}`}
      style={{
        ...baseStyle,
        backgroundColor: 'var(--sage-500)',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: `${Math.round(size * 0.4)}px`,
        letterSpacing: '0.02em',
        userSelect: 'none'
      }}
    >
      {getInitials(user?.full_name)}
    </div>
  );
}

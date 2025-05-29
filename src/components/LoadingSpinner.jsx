import css from './loadingSpinner.module.css';
import mernlogCharacter from '@/assets/mernlog_character.svg';

export default function LoadingSpinner({ message = '잠시만 기다려주세요...' }) {
  return (
    <div className={css.spinnerOverlay}>
      <div className={css.spinnerContent}>
        <img src={mernlogCharacter} alt="MERNLOG 캐릭터" className={css.spinnerImage} />
        <div className={css.spinner} />
        <p className={css.spinnerMessage}>{message}</p>
      </div>
    </div>
  );
}

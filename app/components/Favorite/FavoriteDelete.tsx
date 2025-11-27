"use client";

type Props = {
  placeId: string;
  closeModal: () => void;
  onDelete: (placeId: string) => Promise<void>;
};

export default function FavoriteDelete({
  placeId,
  closeModal,
  onDelete,
}: Props) {
  const handleDelete = async () => {
    closeModal();
    await onDelete(placeId);
  };

  return (
    <div className="search_detail_container">
      <div className="search_detail_header">
        <div className="title">삭제 확인</div>
        <button className="modal-close" onClick={closeModal}>
          x
        </button>
      </div>
      <div className="search_detail_content">
        <div className="modal-meta">정말 삭제하시겠습니까?</div>
      </div>
      <div className="modal-cta">
        <button className="btn btn-primary" onClick={handleDelete}>
          확인
        </button>
        <button className="btn" onClick={closeModal}>
          취소
        </button>
      </div>
    </div>
  );
}

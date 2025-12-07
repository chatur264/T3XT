const ShowImage = () => {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
      onClick={() => setPreviewImage(null)}
    >
      <img
        src={previewImage}
        className="max-w-[90vw] max-h-[90vh] rounded shadow"
      />

      <a
        href={previewImage}
        download
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-6 bg-white text-black px-4 py-2 rounded"
      >
        Download
      </a>
    </div>
  );
};

export default ShowImage;

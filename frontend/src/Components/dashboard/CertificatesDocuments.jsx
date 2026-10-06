import DocumentItem from "./DocumentItem";

function CertificatesDocuments({ documents = [] }) {
  return (
    <div>
      <h3 className="text-lg font-serif font-semibold text-gray-900 mb-3">
        Certificates & Passes
      </h3>
      <div className="bg-white rounded-xl border border-gray-100 px-4 py-1">
        {documents.length === 0 ? (
          <p className="text-xs text-gray-400 py-6 text-center italic">
            No passes or receipts issued yet.
          </p>
        ) : (
          documents.map((doc) => (
            <DocumentItem key={doc.id || doc.title} doc={doc} />
          ))
        )}
      </div>
    </div>
  );
}
export default CertificatesDocuments;
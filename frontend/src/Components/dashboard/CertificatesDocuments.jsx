import DocumentItem from "./DocumentItem";

function CertificatesDocuments({ documents }) {
  return (
    <div>
      <h3 className="text-lg font-serif font-semibold text-gray-900 mb-3">
        Certificates & Documents
      </h3>
      <div className="bg-white rounded-xl border border-gray-100 px-4">
        {documents.map((doc) => (
          <DocumentItem key={doc.title} doc={doc} />
        ))}
      </div>
    </div>
  );
}
export default CertificatesDocuments;
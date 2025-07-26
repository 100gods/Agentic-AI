import Header from '@/components/shared/Header';
import CropDiagnosisForm from './CropDiagnosisForm';

export default function CropDiagnosisPage() {
  return (
    <main className="container mx-auto max-w-3xl py-8 px-4">
      <Header title="Crop Diagnosis" />
      <p className="mb-6 text-muted-foreground">
        Upload a clear photo of the affected crop and provide a brief description of the symptoms. Our AI will analyze the information and provide a diagnosis and potential solutions.
      </p>
      <CropDiagnosisForm />
    </main>
  );
}

import Header from '@/components/shared/Header';
import FinancialAdviceForm from './FinancialAdviceForm';

export default function FinancialAdvicePage() {
  return (
    <main className="container mx-auto max-w-3xl py-8 px-4">
      <Header title="Financial Advice" />
      <p className="mb-6 text-muted-foreground">
        Ask for financial advice related to farming, investments, loans, and government schemes. Provide some details about yourself for more personalized advice.
      </p>
      <FinancialAdviceForm />
    </main>
  );
}

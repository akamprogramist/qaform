
import { GetQuestion } from '@/actions/qaform';
import FormCard from '../components/FormCard';
import QAList from '../components/QAList';

export default async function Home() {
  const { error, question } = await GetQuestion();
  return (
    <div>
      <div className='mx-auto'>
      <FormCard />
      
      <QAList question={question} />
      </div>
    </div>
  );
}

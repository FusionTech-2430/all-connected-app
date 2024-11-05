import MessagesList from '@/components/chat/MessagesList';

const Page = async () => {
  return (
    <div>
      <MessagesList business={false} />
    </div>
  );
};

export default Page;
import MessagesList from '@/components/chat/MessagesList';

const Page = async () => {
  return (
    <div>
      <MessagesList business={true} />
    </div>
  );
};

export default Page;
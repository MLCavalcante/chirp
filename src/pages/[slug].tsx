import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import Image from "next/image";





const ProfilePage: NextPage<{username: string}> = ({username}) => {
  

  const {data} = api.profile.getUserByUsername.useQuery({
    username,
  });
  
  if (!data) return <div>404</div>;

  return ( 
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 border-b bg-slate-600">
          <Image src={data.profileImageUrl} 
          alt= {`${data.username ?? ""}'s profile picture`}
          width={128}
          height={128}
          className="-mb-[64px] absolute bottom-0 left-0 rounded-full border-4 border-black bg-black ml-4"
          />
          </div>
          <div className= "h-[64px]"></div>
          <div className="p-4 text-2xl font-bold">{`@${data.username ?? ""}`}</div>
          <div className="border-b border-slate-400 w-full"/>
      </PageLayout>
    </>
  );
};

import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '~/server/api/root';
import { prisma } from "~/server/db";
import  superjson  from "superjson";
import { PageLayout } from "~/components/layout";

 export const getStaticProps: GetStaticProps = async( context) => {
  const ssg = createProxySSGHelpers({
  router: appRouter,
  ctx: {prisma, userId :null},
  transformer: superjson, // optional - adds superjson serialization
});
  
const slug = context.params?.slug;

if (typeof slug !== "string") throw new Error("no slug");

const username = slug.replace("@", "");

await ssg.profile.getUserByUsername.prefetch({username});

return {
  props: {
    trpcState: ssg.dehydrate(),
    username,
   }
  }
 }

 export const getStaticPaths = () => {
   return {paths: [], fallback: "blocking"}

 }

export default ProfilePage;

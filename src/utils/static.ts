'use server';
import { GetStaticProps } from "next";

export const getStaticProps = (async () => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY ;
      
  return { props: { apiKey } }
  }) as GetStaticProps<{ apiKey: string }>;

  // export const getStaticProps = (async () => {
  //   const apiKey = process.env.GOOGLE_MAPS_API_KEY ;
        
  //   return { props: { apiKey } }
  //   }) as GetStaticProps<{ apiKey: string }>;
    // { apiKey }: InferGetServerSidePropsType<typeof getStaticProps>
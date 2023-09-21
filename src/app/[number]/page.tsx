import { notFound } from 'next/navigation';
import axios, { AxiosResponse } from 'axios';

interface Mosque {
  name: string;
  number: string;
  builded_at: string;
  location: string;
  photo: string;
  info: string;
  latitude: number;
  longitude: number;
}

async function getMosque(number: string): Promise<Mosque | undefined> {
  try {
    const collection = 'mosques';

    const response: AxiosResponse<{ data: Mosque[] }> = await axios.get(
      `https://sia.gov.ae/directus/items/${collection}/`,
      {
        params: {
          filter: {
            number: number,
          },
        },
      }
    );

    if (response.data.data.length === 0) {
      notFound();
      return undefined;
    }

    return response.data.data[0];
  } catch (error) {
    console.error('Error fetching data:', error);
    notFound();
    return undefined;
  }
}

interface DynamicPageProps {
  params: {
    number: string;
  };
}

export default async function DynamicPage({ params }: DynamicPageProps) {
  const mosque = await getMosque(params.number);

  return (
    <div>
      {mosque ? (
        <>
          <div className='container mx-auto md:px-4'>
            <div className='flex flex-col min-h-screen gap-2'>
              <div className='relative'>
                <div className='overflow-hidden h-64'>
                  <img
                    className='bg-red-500 object-cover h-full w-full'
                    src={`https://sia.gov.ae/directus/assets/${mosque.photo}`}
                  />
                </div>
                <div className='absolute bottom-0 h-full flex items-center justify-center'>
                  <div className='bg-black/[.7] text-white py-6 px-2 min-w-[300px]'>
                    <h1 className='text-3xl font-bold'>{mosque.name}</h1>
                  </div>
                </div>
              </div>
              <div className='grow flex flex-col gap-4'>
                <div className='flex flex-col md:flex-row gap-4'>
                  <div className='md:w-1/4 border rounded drop-shadow border-yellow-500 border-1 pr-2 md:pr-4 bg-gradient-to-r from-yellow-200 to-yellow-300'>
                    <div className='w-52 my-9'>
                      <h2 className='text-3xl mb-8 border-b-4 border-blue-300'>نبذة عن المسجد</h2>
                      <div className='flex flex-col gap-2 text-xl'>
                        <div>
                          اسم المسجد: <span className='font-bold'>{mosque.name}</span>
                        </div>
                        <div>
                          رقم المسجد: <span className='font-bold'>{mosque.number}</span>
                        </div>
                        <div>
                          تاريخ الإنشاء: <span className='font-bold'>{mosque.builded_at}</span>
                        </div>
                        <div>
                          المنطقة: <span className='font-bold'>{mosque.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='md:w-3/4 flex flex-col gap-2 w-full'>
                    <img className='aspect-video h-full w-full md:rounded  drop-shadow overflow-hidden' src={`https://sia.gov.ae/directus/assets/${mosque.photo}`} />
                    <p className='text-xl px-2'>{mosque.info}</p>
                  </div>
                </div>
                <div>
                  <iframe className='mb-2 border' src={`https://maps.google.com/maps?q=${mosque.latitude},${mosque.longitude}&z=16&output=embed`} height='300' width='100%'></iframe>
                </div>
              </div>
              <div className='flex flex-col gap-4 bg-gradient-to-r from-blue-400 to-blue-500 py-2 px-4'>
                <div>
                  <img src='https://sia.gov.ae/frontEnd/images/mobile-logo.png' />
                </div>
                <a className='text-xl text-white' href='https://sia.gov.ae'>
                  العودة إلى الصفحة الرئيسية
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Page not found</p>
      )}
    </div>
  );
}

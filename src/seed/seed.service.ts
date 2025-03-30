import { Injectable, Logger } from '@nestjs/common';
import { ScholarshipsService } from '../scholarships/scholarships.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');


  constructor(
    private readonly scholarshipsService: ScholarshipsService,
  ) {}

  async create(createSeedDto: CreateSeedDto) {
    try {
      this.logger.log('Creando seed personalizado');
      return createSeedDto;
    } catch (error) {
      this.logger.error(`Error creando seed: ${error.message}`);
      throw error;
    }
  }

  async executeSeed() {
    try {
      this.logger.log('Ejecutando seed de becas...');
    

      // Datos predefinidos de becas
      const scholarshipsData = [
        {
          scholarship_type: 'castigo',
          description: 'Este apartado no es una beca, es un castigo por conducatas inapropiadas dentro de la institución',
          hours: 80,
          percentage_max_range: ['0'] 
        }
        ,
        {
          scholarship_type: 'excelencia',
          description: 'Beca por excelencia académica',
          hours: 16,
          percentage_max_range: ['80']
        },
        {
          scholarship_type: 'academica',
          description: 'Beca por excelencia académica',
          hours: 16,
          percentage_max_range: ['80']
        },
        {
          scholarship_type: 'deportiva',
          description: 'Beca por mérito deportivo',
          hours: 16,
          percentage_max_range: ['90']
        },
        {
          scholarship_type: 'cultural',
          description: 'Beca por participación en actividades culturales',
          hours: 16,
          percentage_max_range: ['90']
        },
        {
          scholarship_type: 'socioeconomica',
          description: 'Beca para apoyo socioeconómico',
          hours: 16,
          percentage_max_range: [ '70']
        },
        {
          scholarship_type: 'prioritario',
          description: ' Beca por grupo de atencion prioritario',
          hours: 16,
          percentage_max_range: [ '40']
        }
      ];
      
      // Crear y guardar cada beca usando el servicio
      const insertedScholarships = [];
      
      for (const scholarshipData of scholarshipsData) {
        try {
          
          const scholarship = await this.scholarshipsService.create(scholarshipData);
          insertedScholarships.push(scholarship);
          this.logger.log(`Beca ${scholarshipData.scholarship_type} creada correctamente`);
        } catch (error) {
          
          if (error?.code === '23505' || error?.message?.includes('duplicate')) {
            this.logger.warn(`Beca ${scholarshipData.scholarship_type} ya existe`);
          } else {
            this.logger.error(`Error al insertar beca ${scholarshipData.scholarship_type}: ${error.message}`);
          }
        }
      }
      return {
        message: `Seed ejecutado correctamente. ${insertedScholarships.length} becas insertadas.`,
        insertedScholarships
      };
    } catch (error) {
      this.logger.error(`Error general ejecutando seed: ${error.message}`);
      throw error;
    }
  }
}
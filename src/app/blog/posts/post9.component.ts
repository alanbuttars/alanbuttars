import { Component } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-blog-post-9',
  templateUrl: './post9.component.html',
})
export class BlogPost9Component {

  ngAfterViewInit() {
    $(".ui.sticky.page.navigation").sticky({
      context: "#blog"
    });
  }

  gemfile = `source 'https://rubygems.org'
ruby '2.3.7'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

gem 'chewy', '~> 0.10'
`;

  initializer = `# Enable logging messages from Chewy
Chewy.logger = Rails.logger

# For local environments, point Chewy to your local Elasticsearch instance
# For remote environments, check Chewy documentation
if Rails.env.test?
  Chewy.settings = {
    host: 'localhost:9250',
    prefix: 'test',
  }
elsif Rails.env.development?
  Chewy.settings = {
    host: 'localhost:9200',
    prefix: 'development',
  }
end`;

  dbRake = `namespace :db do
  desc "Establish schema and seed database"
  task :go => %w[db:schema db:seed]

  desc "Establish schema"
  task :schema => %w[db:kill db:drop db:create db:migrate chewy:reset]

  desc "Kill existing database connections"
  task :kill do
    begin
      config = ActiveRecord::Base.configurations[Rails.env]
      ActiveRecord::Base.establish_connection(config)
      pid = ActiveRecord::Base.connection.raw_connection.backend_pid
      ActiveRecord::Base.connection.execute("select pg_terminate_backend(pid) from pg_stat_activity where pid <> #{pid} and datname = current_database()")
    rescue => e
      raise unless e.message =~ /database is not configured/
    end
  end
end`;

  elasticsearchRake = `ELASTICSEARCH_PID_FILE = "/tmp/chewy_demo_elasticsearch.pid"

namespace :elasticsearch do
  desc "Safely start elasticsearch"
  task :go => %w[elasticsearch:kill elasticsearch:start]

  desc "Start elasticsearch"
  task :start do
    elasticsearch_home = ENV["ELASTICSEARCH_HOME"]
    raise "Please set ELASTICSEARCH_HOME environment variable" if elasticsearch_home.nil?
    system("sh #{elasticsearch_home}/bin/elasticsearch -d -p #{ELASTICSEARCH_PID_FILE}")
  end

  desc "Kill existing elasticsearch"
  task :kill do
    next unless File.exists?(ELASTICSEARCH_PID_FILE)
    lines = File.readlines(ELASTICSEARCH_PID_FILE)
    next unless lines.size == 1
    pid = lines.first
    system("kill -9 #{pid}")
  end
end`;

  chewyTextField = {
    migration: `class Release001 < ActiveRecord::Migration[5.0]
  def change
    create_table :colleges do |t|
      # Index all fields that will be searched
      t.string :name,           null: false, index: true
      t.string :alias,          null: true, index: true
    end`,
  
    record: `class College < ActiveRecord::Base
  # Ensure indexes are updated when records are updated
  update_index('colleges#college') { self }
end`,
  
    index: `class CollegesIndex < Chewy::Index
  define_type College do
    # On creation/update, define the fields to be indexed
    root do
      field :name
      field :alias
    end
  end
end`,

  service: `class CollegeService
  def self.search(params)
    query = params[:query]

    # If the user didn't pass a query, return all colleges
    college_query = CollegesIndex.query(
      match_all: {},
    )

    if query.present?
      college_query = college_query.query(
        # Fuzzy search across both name and alias fields
        multi_match: {
          query: query,
          fields: [
            :name,
            :alias,
          ],
          fuzziness: "AUTO",
        },
      )
    end

    college_query.records.compact
  end
end`
  };

  chewyNameField = {
    migration: `class Release001 < ActiveRecord::Migration[5.0]
  def change
    create_table :employees do |t|
      # Index all fields that will be searched
      t.string :first_name,     null: false, index: true
      t.string :last_name,      null: false, index: true
    end
  end
end`,
    record: `class Employee < ActiveRecord::Base
  # Ensure indexes are updated when records are updated
  update_index('employees#employee') { self }

  def full_name
    "#{first_name} #{last_name}"
  end
end`,
    index: `class EmployeesIndex < Chewy::Index
  settings analysis: {
    analyzer: {
      metaphone: {
        type: 'custom',
        tokenizer: 'standard',
        filter: ['my_metaphone'],
      },
      porter: {
        type: 'custom',
        tokenizer: 'standard',
        filter: ['lowercase', 'porter_stem'],
      },
    },
    filter: {
      my_metaphone: {
        encoder: 'metaphone',
        replace: false,
        type: 'phonetic',
      },
    },
  }

  define_type Employee do
    root do
      field :pty_surename, analyzer: 'simple', value: ->(employee) do
        employee.full_name
      end
      field :metaphone, analyzer: 'metaphone', value: ->(employee) do
        employee.full_name
      end
      field :porter, analyzer: 'porter', value: ->(employee) do
        employee.full_name
      end
    end
  end
end`,
    service: `class EmployeeService
  def self.search(params)
    query = params[:query]

    employee_query = EmployeesIndex.query(
      bool: {
        should: [
          {
            bool: {
              should: [
                {
                  match: {
                    pty_surename: {
                      query: query,
                    },
                  },
                },
                {
                  match: {
                    pty_surename: {
                      query: query,
                      fuzziness: 1,
                    },
                  },
                },
                {
                  match: {
                    'pty_surename.metaphone' => {
                      query: query,
                    },
                  },
                },
                {
                  match: {
                    'pty_surename.porter' => {
                      query: query,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    )

    employee_query.records.compact
  end
end`
  };

  chewyLocationField = {
    migration: `class Release001 < ActiveRecord::Migration[5.0]
  def change
    create_table :colleges do |t|
      t.string :name,           null: false, index: true
      t.string :alias,          null: true, index: true
      # Index all fields that will be searched
      t.float :latitude,        null: false, index: true
      t.float :longitude,       null: false, index: true
    end
  end
end`,

    record: `class College < ActiveRecord::Base
  # Ensure indexes are updated when records are updated
  update_index('colleges#college') { self }
end`,

    index: `class CollegesIndex < Chewy::Index
  define_type College do
    root do
      field :name
      field :alias
      field :location, type: "geo_point", value: ->(college) do
        { lat: college.latitude, lon: college.longitude }
      end
    end
  end
end`,

    service: `class CollegeService
  def self.search(params)
    query = params[:query]
    latitude = params[:latitude]
    longitude = params[:longitude]

    college_query =
      if latitude.present? && longitude.present?
        CollegesIndex.query(
          # Limit colleges to those within 150 miles
          geo_distance: {
            distance: "150miles",
            location: {
              lat: latitude,
              lon: longitude,
            },
          },
        ).order(
          # Sort by closest colleges first
          _geo_distance: {
            location: {
              lat: latitude,
              lon: longitude,
            },
            order: :asc,
            unit: :miles,
          },
        )
      else
        # If the user didn't pass a location, return all colleges
        CollegesIndex.query(
          match_all: {},
        )
      end

    if query.present?
      # Further limit results by those matching the text query
      college_query = college_query.query(
        multi_match: {
          query: query,
          fields: [
            :name,
            :alias,
          ],
          fuzziness: "AUTO",
        },
      )
    end

    college_query.records.compact
  end
end`
  };

  chewyOneToOneField = {
    migration: `class Release001 < ActiveRecord::Migration[5.0]
  def change
    create_table :colleges do |t|
      t.string :name,           null: false, index: true
    end

    create_table :employees do |t|
      # Index all fields that will be searched
      t.belongs_to :college
      t.string :first_name,     null: false, index: true
      t.string :last_name,      null: false, index: true
    end
  end
end`,
    employeeRecord: `class Employee < ActiveRecord::Base
  # Ensure indexes are updated when records are updated
  update_index('employees#employee') { self }
  update_index('colleges') { college }

  belongs_to :college

  def full_name
    "#{first_name} #{last_name}"
  end
end`,
    collegeRecord: `class College < ActiveRecord::Base
  # Ensure indexes are updated when a college record is updated
  update_index('colleges#college') { self }
  # Ensure employee indexes are updated when a college record is updated
  update_index('employees') { employees }

  has_many :employees
end`,

    index: `class EmployeesIndex < Chewy::Index
  # These come from the "Searching name fields example"
  settings analysis: {
    analyzer: {
      metaphone: {
        type: 'custom',
        tokenizer: 'standard',
        filter: ['my_metaphone'],
      },
      porter: {
        type: 'custom',
        tokenizer: 'standard',
        filter: ['lowercase', 'porter_stem'],
      },
    },
    filter: {
      my_metaphone: {
        encoder: 'metaphone',
        replace: false,
        type: 'phonetic',
      },
    },
  }

  define_type Employee.includes(:college) do
    root do
      field :pty_surename, analyzer: 'simple', value: ->(employee) do
        employee.full_name
      end
      field :metaphone, analyzer: 'metaphone', value: ->(employee) do
        employee.full_name
      end
      field :porter, analyzer: 'porter', value: ->(employee) do
        employee.full_name
      end
      # Store the college_id alongside the employee in the index
      field :college_id, value: ->(employee) do
        employee.college.id
      end
    end
  end
end`,
    service: `class EmployeeService
  def self.search(params)
    college_id = params[:college_id]
    query = params[:query]

    employee_query = EmployeesIndex.query(
      # Only return employees which belong to the given college
      match: {
        college_id: college_id,
      }
    ).query(
      bool: {
        should: [
          {
            bool: {
              should: [
                {
                  match: {
                    pty_surename: {
                      query: query,
                    },
                  },
                },
                {
                  match: {
                    pty_surename: {
                      query: query,
                      fuzziness: 1,
                    },
                  },
                },
                {
                  match: {
                    'pty_surename.metaphone' => {
                      query: query,
                    },
                  },
                },
                {
                  match: {
                    'pty_surename.porter' => {
                      query: query,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    )

    employee_query.records.compact
  end
end`
  };

  chewyOneToManyField = {
    migration: `class Release001 < ActiveRecord::Migration[5.0]
  def change
    # Index all fields that will be searched
    create_table :colleges do |t|
      t.string :name,           null: false, index: true
      t.string :alias,          null: true, index: true
      t.float :latitude,        null: false, index: true
      t.float :longitude,       null: false, index: true
    end

    create_table :labels do |t|
      t.string :code,           null: false, index: true, unique: true
    end

    create_table :colleges_labels, id: false do |t|
      t.belongs_to :college,    null: false
      t.belongs_to :label,      null: false
    end
  end
end`,
    collegeRecord: `class College < ActiveRecord::Base
  # Ensure college index is updated when a college record is updated
  update_index('colleges#college') { self }
  # Ensure labels indices are updated when a college record is updated
  update_index('labels') { labels }

  has_and_belongs_to_many :labels
end`,
    labelRecord: `class Label < ActiveRecord::Base
  # Ensure label index is updated when a label record is updated
  update_index('labels#label') { self }
  # Ensure associated colleges' indices are updated when a label record is updated
  update_index('colleges') { colleges }

  has_and_belongs_to_many :colleges
end`,
    collegeIndex: `class CollegesIndex < Chewy::Index
  # The includes statement ensures that the associated labels are preloaded
  define_type College.includes(:labels) do
    root do
      field :name
      field :alias
      # This example uses "not_analyzed" since the input is not from a user,
      # but rather from a preset list of keywords
      field :label_codes, index: "not_analyzed", value: -> (college) do
        college.labels.map(&:code)
      end
      # This comes from the "Searching location fields" example
      field :location, type: "geo_point", value: ->(college) do
        { lat: college.latitude, lon: college.longitude }
      end
    end
  end
end`,
    labelIndex: `class LabelsIndex < Chewy::Index
  # No need to index anything, since the label code will be treated
  # as a keyword
  define_type Label do
  end
end`,
    service: `class CollegeService
  def self.search(params)
    query = params[:query]
    label_code = params[:label_code]
    latitude = params[:latitude]
    longitude = params[:longitude]

    college_query =
      # This comes from the "Searching location fields" example
      if latitude.present? && longitude.present?
        CollegesIndex.query(
          geo_distance: {
            distance: "150miles",
            location: {
              lat: latitude,
              lon: longitude,
            },
          },
        ).order(
          _geo_distance: {
            location: {
              lat: latitude,
              lon: longitude,
            },
            order: :asc,
            unit: :miles,
          },
        )
      else
        # If the user doesn't pass location, don't restrict by location
        CollegesIndex.query(
          match_all: {},
        )
      end

    if label_code.present?
      # Restrict colleges by those that match at least one of the codes passed
      college_query = college_query.query(
        match: {
          label_codes: label_code,
        },
      )
    end

    if query.present?
      # This comes from the "Searching text fields" example
      college_query = college_query.query(
        multi_match: {
          query: query,
          fields: [
            :name,
            :alias,
          ],
          fuzziness: "AUTO",
        },
      )
    end

    college_query.records.compact
  end
end`
  };
}
